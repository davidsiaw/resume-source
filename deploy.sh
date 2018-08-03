#!/bin/bash
pushd react
kichi in resume_env run npm run build
popd
kichi in resume_env run bundle exec weaver build -r https://resume.davidsiaw.net
rm -rf build/react
rm -rf build/data
cp -r react/build build/react
cp -r react/build/data build/data
bundle exec sumomo -r us-east-1 update -f Sumomofile.us-east-1 resumeenvoriginlambda
kichi in resume_env run bundle exec sumomo update resumeenv
