sync-github-users-ssh-keys
==========================

Utility to synchronize public ssh keys for a github team with servers.
Basically, this utility generates the authorized_keys file that you
probably would like to distribute manually or through Chef/Puppet onto
your servers to allow SSH access for the Github team members.

REQUIREMENTS
============
Nodejs - Install it from [Here](https://nodejs.org)

INSTALL
=======

- ```npm install```

- Generate a Github Token from [Here](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization) - (Use __Generate New Token__)

USAGE
=====

- List all teams within an org

```node sync.js --github-token TOKEN --org MY_GITHUB_ORG --list-teams [--debug]```

- Generate the authorized_keys file corresponding to the members of a single team

```node sync.js --github-token TOKEN --org MY_GITHUB_ORG --team-id
TEAM-ID --output PATH_TO_OUTPUT_FILE [--debug]```


EXAMPLES
========

- List Teams within the mozilla organization
```node sync.js --github-token TOKEN --org NewCorp --list-teams```

- Generate the authorized_keys file for team ABC in org NewCorp
```node sync.js --github-token TOKEN --team-id 801500 --org ifeelgoods --output authorized_keys
