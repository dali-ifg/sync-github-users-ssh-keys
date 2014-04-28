var GitHubApi = require("github"),
_ = require("lodash"),
fs = require('fs'),
async = require('async'),
path = require("path"),
nopt = require('nopt');

var knownOpts = {
  'org'     : [String, null],
  'team-id' : [String, null],
  'github-token' : [String, null],
  'debug' : Boolean,
  'list-teams' : Boolean,
  'output'  : path
  };

var parsed_opts = nopt(knownOpts, {}, process.argv, 2);

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    //debug: true,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    token: parsed_opts['github-token']
});

if (parsed_opts['list-teams']) {
  github.orgs.getTeams({
    org: parsed_opts.org
  }, function(err, res) {
    console.log(res);
  });
} else {
  var file = fs.createWriteStream(parsed_opts.output);
  file.on('error', function(err) { console.log('Hit an error writing to file!' + err); });

    github.orgs.getTeamMembers({
      id: parsed_opts['team-id']
    }, function(err, res) {
      if (err) {
        console.log('Hit an error retrieving details for Team Id : ' + parsed_opts['team-id']);
      } else {
        var logins = _.pluck(res, 'login');
        if (parsed_opts.debug) console.log(logins);

        var array_fn = _.map(logins, function(login) {
          return function(cb) {
            github.user.getKeysFromUser({
              user : login,
            }, function (err, res) {
              cb(null,_.pluck(res, 'key'));
            });
          };
        });

        var users_public_ssh_keys = [];

        async.parallel(array_fn, function(err, results) {
          users_public_ssh_keys = _.flatten(results);
          if (parsed_opts.debug) console.log(users_public_ssh_keys);
          users_public_ssh_keys.forEach(function(key) { file.write( key + '\n');});
          file.end();

        });
      }
    });
}
