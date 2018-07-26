#!/bin/bash

kichi in resume_env run bundle exec weaver build -r https://resume.davidsiaw.net
bundle exec sumomo -r us-east-1 update -f Sumomofile.us-east-1 resumeenvoriginlambda
kichi in resume_env run bundle exec sumomo update resumeenv
