appstream_file = i18n.merge_file(
  input: 'surf.tangent.Tangent.metainfo.xml',
  output: 'surf.tangent.Tangent.metainfo.xml',
  po_dir: '../../po',
  install: true,
  install_dir: join_paths(get_option('datadir'), 'metainfo')
)

appstream_util = find_program('appstream-util', required: false)
if appstream_util.found()
  test('Validate appstream file', appstream_util,
    args: ['validate', appstream_file]
  )
endif
