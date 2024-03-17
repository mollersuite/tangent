bin_conf = configuration_data()
bin_conf.set('GJS', find_program('gjs').full_path())
bin_conf.set('version', meson.project_version())
bin_conf.set('app_id', app_id)
bin_conf.set('prefix', prefix)
bin_conf.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
bin_conf.set('datadir', datadir)
bin_conf.set('pkgdatadir', pkgdatadir)

configure_file(
  input: 'bin.js',
  output: 'surf.tangent.Tangent',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)

gresource = custom_target('gjspack',
  input: ['main.js', '../po/POTFILES'],
  output: meson.project_name() + '.src.gresource',
  command: [
    'gjs',
    '-m', '../src/troll/gjspack/bin/gjspack',
    '--appid=' + meson.project_name(),
    '--project-root', meson.source_root(),
    '--resource-root', meson.project_source_root(),
    '@INPUT0@',
    '--potfiles', '@INPUT1@',
    '@OUTDIR@',
  ],
  install: true,
  install_dir: pkgdatadir,
  build_always_stale: true,
)
