const Uppy = require('uppy/lib/core')
const Dashboard = require('uppy/lib/plugins/Dashboard')
const GoogleDrive = require('uppy/lib/plugins/GoogleDrive')
const Dropbox = require('uppy/lib/plugins/Dropbox')
const Instagram = require('uppy/lib/plugins/Instagram')
const Webcam = require('uppy/lib/plugins/Webcam')
const Tus = require('uppy/lib/plugins/Tus')

const UPPY_SERVER = require('../env')

const PROTOCOL = location.protocol === 'https:' ? 'https' : 'http'
const TUS_ENDPOINT = PROTOCOL + '://master.tus.io/files/'

function uppyInit () {
  const opts = window.uppyOptions2
  const dashboardEl = document.querySelector('.UppyDashboard')
  if (dashboardEl) {
    const dashboardElParent = dashboardEl.parentNode
    dashboardElParent.removeChild(dashboardEl)
  }

  const restrictions = {
    maxFileSize: 1000000,
    maxNumberOfFiles: 3,
    minNumberOfFiles: 2,
    allowedFileTypes: ['image/*', 'video/*']
  }

  const uppy = Uppy({
    debug: true,
    autoProceed: opts.autoProceed,
    restrictions: opts.restrictions ? restrictions : ''
  })

  uppy.use(Dashboard, {
    trigger: '.UppyModalOpenerBtn',
    inline: opts.DashboardInline,
    target: opts.DashboardInline ? '.DashboardContainer' : 'body',
    note: opts.restrictions ? 'Images and video only, 2–3 files, up to 1 MB' : '',
    metaFields: [
      { id: 'license', name: 'License', placeholder: 'specify license' },
      { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
    ]
  })

  if (opts.GoogleDrive) {
    uppy.use(GoogleDrive, { target: Dashboard, host: UPPY_SERVER })
  }

  if (opts.Dropbox) {
    uppy.use(Dropbox, { target: Dashboard, host: UPPY_SERVER })
  }

  if (opts.Instagram) {
    uppy.use(Instagram, { target: Dashboard, host: UPPY_SERVER })
  }

  if (opts.Webcam) {
    uppy.use(Webcam, { target: Dashboard })
  }

  uppy.use(Tus, { endpoint: TUS_ENDPOINT, resume: true })
  uppy.run()

  uppy.on('complete', result => {
    console.log('successful files:', result.successful)
    console.log('failed files:', result.failed)
  })
}

uppyInit()
window.uppyInit = uppyInit
