#!/usr/bin/env -S gjs -m
/// <reference types="gjs/dom" />

import { exit, programArgs, programInvocationName } from "system"
import { setConsoleLogDomain } from "console"
import Gio from "gi://Gio?version=2.0"

imports.package.init({
	name: "@app_id@",
	version: "@version@",
	prefix: "@prefix@",
	libdir: "@libdir@",
	datadir: "@datadir@",
})

imports.package._findEffectiveEntryPointName = () => "@app_id@" // https://github.com/NixOS/nixpkgs/issues/31168#issuecomment-341793501

setConsoleLogDomain(pkg.name)

const resource = Gio.resource_load("@datadir@/@app_id@/Tangent.src.gresource")
Gio.resources_register(resource)

const { main } = await import("resource:///Tangent/src/main.js")
const exit_code = await main([programInvocationName, ...programArgs])
exit(exit_code)
