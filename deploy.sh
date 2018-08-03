#!/bin/bash
pushd react
kichi in resume_env run REACT_APP_MIXPANEL_TOKEN="\$MIXPANEL_TOKEN" npm run build
popd
kichi in resume_env run bundle exec weaver build -r https://resume.davidsiaw.net
cp -r react/build build/react
cp -r react/build/data build/data
bundle exec sumomo -r us-east-1 update -f Sumomofile.us-east-1 resumeenvoriginlambda
kichi in resume_env run bundle exec sumomo update resumeenv
