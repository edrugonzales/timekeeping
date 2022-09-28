import { Icon } from '@iconify/react'
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill'
import personAddOutline from '@iconify/icons-eva/person-add-outline';
import personDeleteOutline from '@iconify/icons-eva/person-delete-outline';
import imageFill from '@iconify/icons-eva/image-outline'
import fileFill from '@iconify/icons-eva/file-text-outline'
import compassFill from '@iconify/icons-eva/compass-outline'
import edit2Outline from '@iconify/icons-eva/edit-2-outline';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />
let _config = [
  {
    title: 'dashboard',
    path: '/stores/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'QR code',
    path: '/stores/qr',
    icon: getIcon(imageFill),
  },
  {
    title: 'user',
    path: '/stores/user',
    icon: getIcon(personAddOutline),
  },
  {
    title: 'archived user',
    path: '/stores/archive',
    icon: getIcon(personDeleteOutline),
  },
  {
    title: 'time adjustment',
    path: '/stores/adjustment',
    icon: getIcon(edit2Outline),
  },
  {
    title: 'reports',
    path: '/stores/reports',
    icon: getIcon(fileFill),
  },
  {
    title: 'admin',
    path: '/stores/admin',
    icon: getIcon(compassFill),
  },
]

let _configWOBranch = [
  {
    title: 'dashboard',
    path: '/stores/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'QR code',
    path: '/stores/qr',
    icon: getIcon(imageFill),
  },
  {
    title: 'user',
    path: '/stores/user',
    icon: getIcon(personAddOutline),
  },
  {
    title: 'archived user',
    path: '/stores/archive',
    icon: getIcon(personDeleteOutline),
  },
  {
    title: 'time adjustment',
    path: '/stores/adjustment',
    icon: getIcon(edit2Outline),
  },
  {
    title: 'reports',
    path: '/stores/reports',
    icon: getIcon(fileFill),
  }
]

let exp_object = { _config, _configWOBranch }
export default exp_object