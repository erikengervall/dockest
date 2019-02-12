#!/bin/sh

yarn build
git add ./dist
git commit --amend --no-edit
