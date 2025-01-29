import sys
import re
from functools import reduce

release_notes = sys.stdin.read()

categories = {
    "features": {
        "pattern": re.compile(r'MIJN-[0-9]+-FEATURE', flags=re.IGNORECASE),
        "commits": []
    },
    "chores": {
        "pattern": re.compile(r'MIJN-[0-9]+-CHORE', flags=re.IGNORECASE),
        "commits": []
    },
    "bugs": {
        "pattern": re.compile(r'MIJN-[0-9]+-BUG', flags=re.IGNORECASE),
        "commits": []
    },
}

other = {
    # Must start with a commit hash
    "pattern": re.compile(r'^[a-z\d]+\b'),
    "commits": []
}

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
        if (other["pattern"].match(line)):
            other["commits"].append(line)
        else:
            print(f"No matches, ignoring '{line}'", file=sys.stderr)

# Format
# ================================
categories["other"] = other

release_notes = ["## Release Notes\n"]

def format_category(acc, category):
    commits = categories[category]["commits"]
    if not commits:
        return acc

    # Add title in markdown.
    acc.append(f"### {category.title()}\n")

    for commit in commits:
        acc.append(commit)

    # Make sure a newline is added after the block of commits.
    acc.append("")

    return acc

release_notes = reduce(format_category, categories, release_notes)
print('\n'.join(release_notes))

