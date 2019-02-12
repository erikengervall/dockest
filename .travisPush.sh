#!/bin/sh

setup_git() {
  git config --global user.email "erik.engervall@gmail.com"
  git config --global user.name "Travis CI"
}

commit_build_files() {
  yarn build
  git pull
  git checkout $BRANCH
  git add ./dist
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

push_build_files() {
  git remote add master https://github.com/erikengervall/dockest.git > /dev/null 2>&1
  git push --set-upstream origin $BRANCH 
}

setup_git
commit_build_files
push_build_files