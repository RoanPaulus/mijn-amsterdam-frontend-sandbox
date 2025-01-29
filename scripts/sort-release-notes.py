import sys
import re
from functools import reduce

release_notes = sys.stdin.read()

categories = {
    "features": {
        "pattern": re.compile('MIJN-[0-9]+-FEATURE', flags=re.IGNORECASE),
        "commits": []
    },
    "chores": {
        "pattern": re.compile('MIJN-[0-9]+-CHORE', flags=re.IGNORECASE),
        "commits": []
    },
    "bugs": {
        "pattern": re.compile('MIJN-[0-9]+-BUG', flags=re.IGNORECASE),
        "commits": []
    },
}
other = []

# Sort release notes
# ==================
for line in release_notes.split('\n'):

    def identify(acc, category):
        if categories[category]["pattern"].search(line):
            return category
        return acc

    category = reduce(identify, categories, None)

    try:
        categories[category]["commits"].append(line)
    except KeyError:
        other.append(line)

# Format
# ================================
categories["other"] = {
    "commits": other
}

release_notes = ["## Release Notes\n"]

def format_category(acc, category):
    commits = categories[category]["commits"]
    if not commits:
        return acc

    # Add title in markdown.
    acc.append(f"### {category.title()}\n")

    for commit in commits:
        acc.append(commit)

    # Make sure a newline is added
    acc.append("")

    return acc

release_notes = reduce(format_category, categories, release_notes)
print('\n'.join(release_notes))

