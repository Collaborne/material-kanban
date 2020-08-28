#!/bin/sh

exposed_directory=${PWD}/exposed

# Clean out the exposed directory and recreate it
rm -rf "${exposed_directory}" && mkdir -p "${exposed_directory}"

# Link the various pieces we need to make it look like our package
for f in src $(node -p '(require("./package.json").files || []).join("\n")'); do
	ln -s "../${f}" "${exposed_directory}/${f}"
done
# Hardlink files such as package.json to prevent smart tools trying to bork things.
for f in package.json; do
	ln "${f}" "${exposed_directory}/${f}"
done
(cd "${exposed_directory}" && NODE_ENV=production npm link)

npm install
npm run build -- --watch
