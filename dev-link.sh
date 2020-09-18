#!/bin/sh

#
# Prepare the current component so it can be consumed in another project through
# `npm link`-ing it.
#
# Note that the changes from https://github.com/facebook/create-react-app/pull/7993
# to disable the symlink resolving in webpack must be applied in the target
# application.
#

exposed_directory=${PWD}/exposed

# Clean out the exposed directory and recreate it
rm -rf "${exposed_directory}" && mkdir -p "${exposed_directory}"

# Link the various pieces we need to make it look like our package
for f in $(node -p '(require("./package.json").files || []).join("\n")'); do
	ln -s "../${f}" "${exposed_directory}/${f}"
done
# Hardlink files such as package.json to prevent smart tools trying to bork things.
for f in package.json; do
	ln "${f}" "${exposed_directory}/${f}"
done
(cd "${exposed_directory}" && NODE_ENV=production npm link)

npm install
npm run build -- --watch
