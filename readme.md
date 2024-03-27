# Mijn-Amsterdam Front-end

Hi and welcome to the **Mijn-Amsterdam** front-end + bff repository!

This repo is the main codebase for the web application found at [mijn.amsterdam.nl](https://mijn.amsterdam.nl) which
is a portal for official communication with the municipality of Amsterdam. The application consists of 2 main parts:

- React application
- Node Express back-end-for-frontend (BFF)

To see the application quickly running locally, clone the repo and cd into the project folder. Inside the project folder create a new file called `.env.local`. Put the following content inside the file AND ask one of the developers for more environment settings:

```
BROWSER=none
```

Put the following commands in your terminal:

```
$ npm install -g ts-node nodemon
$ npm install
$ npm run bff-api:watch
$ npm start
```

## Accessibility + Targeted browsers

The Mijn Amsterdam design and development team works hard to ensure mijn.amsterdam.nl is [accessible](https://mijn.amsterdam.nl/toegankelijkheidsverklaring).
Not all browsers in the world are supported. The targeted browsers can be found [here](https://github.com/Amsterdam/mijn-amsterdam-frontend/blob/main/package.json#L34).

## React application

- The language used is `Typescript`
- The application is built and tested with [vite/vitest](https://vitejs.dev/).
- Only functional components are used in combination with the hooks api.
- For styling we use [scss](https://create-react-app.dev/docs/adding-a-sass-stylesheet) and [scss modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet)

There is no super strict convention (yet) for grouping components, functions, types etc. For larger components we might want to separate for example additional components, helpers, config and constants
into other files as done in `src/client/pages/Profile` or `src/server/services/focus`.

A blueprint for basic components can be found in `components/AlphaComponent/`. A blueprint for page components is located in `pages/AlphaPage`.
To generate a component based on these blueprints you can either copy/paste rename stuff or use a tool like `npm install -g generact` which can
be used to duplicate any component and assign it a specific name.

## BFF api

The BFF api is the goto part of the application where we do data fetching, data transformations, short-lived request/response caching, error handling and response formatting.
The codebase is also written in typescript so a compilation step is required for it to work. For development purposes we use `ts-node` which takes care of compiling and running the BFF app.

### Authentication

We use an OIDC idp to authenticate the users via Digid or Eherkenning. The max session duration is 15 \* 60 seconds = 15 minutes. Incoming tokens are verified and passed along with the requests to the microservices.
In the microservices these tokens are verified once more for added security.

### BFF Development api

The BFF also has a router that's intended for development purposes only. Not all api requests are targeted at the BFF api in production, some requests are made to the microservice api's directly.
For this purpose we have a development router with mock endpoints see `router-development.ts`. For example, vergunning documents and resident count are retrieved directly without going through the BFF.
It's basically an additional development server integrated in the BFF api.

## Tooling

#### System

- `node`
- `typescript`
- `vite`

#### Required IDE plugins

- `prettier`
- `.editorconfig`

#### Testing and development

- `vitest` for BFF development

### Branch naming + PR

- When creating a new branch, preferably, branch off `main`
- When creating a branch, start the name with a ticket number from Jira e.g: `mijn-1234-update-logo`
- Try to rebase on main and squash commits when PR'ing to it so we keep a fairly clean commit log on Main

### Continuous integration / Continuous deployment

We currently work with a trunk based development approach. [see also](https://trunkbaseddevelopment.com) This means we have relatively short lived branches and only 1 main branch (main)
The main branch should always be production worthy in terms of functionality, stability and code quality.
Every release to production is accompanied with a release tag in the from of: `release-v1.2.3`. Whenever you are about create a release, use the `npm run release` or `npm run release:(major|bug)` (for more specific versions) command. This command
creates a [semver](https://semver.org/) version of the release tag and pushes it to origin. The CI/CD pipeline will automatically detect the tag and starts building a production image.

The building and testing is done via Jenkins which uses `Docker` and `docker-compose` to control server stack requirements and pipeline set-up/running.
