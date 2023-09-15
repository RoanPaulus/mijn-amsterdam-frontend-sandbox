pipeline {
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
    disableConcurrentBuilds()
  }
  agent any

  environment {
    COMMIT_HASH = GIT_COMMIT.substring(0, 8)
    PROJECT_PREFIX = "${BRANCH_NAME}_${COMMIT_HASH}_${BUILD_NUMBER}_"
    IMAGE_BASE = "docker-registry.secure.amsterdam.nl/mijnams/mijnamsterdam"
    IMAGE_ACCEPTANCE = "${IMAGE_BASE}:acceptance"
    IMAGE_ACCEPTANCE_BFF = "${IMAGE_BASE}-bff:acceptance"
    IMAGE_PRODUCTION = "${IMAGE_BASE}:production"
    IMAGE_PRODUCTION_BFF = "${IMAGE_BASE}-bff:production"
    IMAGE_TEST = "${IMAGE_BASE}:test"

    // Client-side data. Not secret.
    REACT_APP_SENTRY_DSN = "https://d9bff634090c4624bce9ba7d8f0875dd@sentry-new.data.amsterdam.nl/13"
    REACT_APP_ANALYTICS_ID_ACC = "e63312c0-0efe-4c4f-bba1-3ca1f05374a8"
    REACT_APP_ANALYTICS_ID_PROD = "f558164e-e388-49e0-864e-5f172552789c"
  }

  stages {

    stage('Unit tests') {
      when {
        not {
          anyOf {
            branch 'test';
            branch 'test-acc';
            branch 'test-acc-bff';
            branch 'test-acc-frontend';
          }
        }
      }
      options {
        timeout(time: 7, unit: 'MINUTES')
      }
      environment {
        PROJECT = "${PROJECT_PREFIX}unit"
      }
      steps {
        script { currentBuild.displayName = "Unit testing #${BUILD_NUMBER}" }
        sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-unit-client test-unit-client"
        sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-unit-bff test-unit-bff"
      }
      post {
        always {
          sh "docker-compose -p ${PROJECT} down -v --rmi local || true"
        }
      }
    }

    // TEST

    stage('Build TEST') {
      when { branch 'test' }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "TEST Build #${BUILD_NUMBER}" }
        sh "docker build -t ${IMAGE_TEST} " +
           "--shm-size 1G " +
           "--build-arg MA_OTAP_ENV=development " +
           "--target=serve-ot-bff " +
           "."
        sh "docker push ${IMAGE_TEST}"
      }
    }

    stage('Deploy TEST') {
      when { branch 'test' }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "TEST Deploy #${BUILD_NUMBER}" }
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-mijnamsterdam-frontend-test.yml']
        ]
      }
    }

    // ACCEPTANCE

    stage('Build BFF') {
      when {
        not {
          anyOf {
            branch 'production-release-v*';
            branch 'test';
            branch 'test-acc-frontend';
          }
        }
      }
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "ACC Build BFF #${BUILD_NUMBER}" }
        // build the BFF/node image
        sh "docker build -t ${IMAGE_ACCEPTANCE_BFF} " +
           "--target=deploy-ap-bff " +
           "--shm-size 1G " +
           "."
        sh "docker push ${IMAGE_ACCEPTANCE_BFF}"
      }
    }

    stage('Deploy BFF') {
      when {
        anyOf {
          branch 'main';
          branch 'test-acc';
          branch 'test-acc-bff';
        }
      }
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "ACC Deploy BFF #${BUILD_NUMBER}" }
        // Build the BFF
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy.yml'],
          [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_mijnamsterdam-bff"]
        ]
      }
    }

    stage('Build Front-end') {
      when {
        not {
          anyOf {
            branch 'production-release-v*';
            branch 'test';
            branch 'test-acc-bff';
          }
        }
      }
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "ACC Build Front-end #${BUILD_NUMBER}" }
        // build the Front-end/nginx image
        sh "docker build -t ${IMAGE_ACCEPTANCE} " +
           "--build-arg MA_OTAP_ENV=acceptance " +
           "--build-arg REACT_APP_SENTRY_DSN=${REACT_APP_SENTRY_DSN} " +
           "--build-arg REACT_APP_ANALYTICS_ID=${REACT_APP_ANALYTICS_ID_ACC} " +
           "--target=deploy-acceptance-frontend " +
           "--shm-size 1G " +
           "."
        sh "docker push ${IMAGE_ACCEPTANCE}"
      }
    }

    stage('Deploy Front-end') {
      when {
        anyOf {
          branch 'main';
          branch 'test-acc';
          branch 'test-acc-frontend';
        }
      }
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "ACC Deploy #${BUILD_NUMBER}" }
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy.yml'],
          [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_mijnamsterdam"]
        ]
       
      }
    }

    // PRODUCTION

    stage('Build PROD') {
      when {
        branch 'production-release-v*'
      }
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "PROD:Build:#${BUILD_NUMBER}" }
        sh "docker build -t ${IMAGE_PRODUCTION} " +
           "--build-arg REACT_APP_SENTRY_DSN=${REACT_APP_SENTRY_DSN} " +
           "--build-arg REACT_APP_ANALYTICS_ID=${REACT_APP_ANALYTICS_ID_PROD} " +
           "--target=deploy-production-frontend " +
           "--shm-size 1G " +
           "."
        sh "docker push ${IMAGE_PRODUCTION}"

        // Build the BFF production image
        // TODO: Pull ACC image, re tag and set ENV RUN variables
        sh "docker build -t ${IMAGE_PRODUCTION_BFF} " +
           "--target=deploy-ap-bff " +
           "--shm-size 1G " +
           "."
        sh "docker push ${IMAGE_PRODUCTION_BFF}"
      }
    }

    stage('Deploy PROD - Waiting for approval') {
      when {
        branch 'production-release-v*'
      }
      options {
        timeout(time: 120, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "PROD:Deploy approval:#${BUILD_NUMBER}" }
        script {
          input "Deploy to Production?"
          echo "Okay, moving on"
        }
      }
    }

    stage('Deploy PROD') {
      when {
        branch 'production-release-v*'
      }
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        script { currentBuild.displayName = "PROD:Deploy:#${BUILD_NUMBER}" }

         // Build the BFF
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy.yml'],
          [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_mijnamsterdam-bff"]
        ]

        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy.yml'],
          [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_mijnamsterdam"]
        ]
      }
    }
  }

  post {
    success {
      echo 'Pipeline success'
    }

    failure {
      echo 'Something went wrong while running pipeline'
      slackSend(
        channel: 'ci-channel',
        color: 'danger',
        message: "${JOB_NAME}: failure ${BUILD_URL}"
      )
    }
  }
}
