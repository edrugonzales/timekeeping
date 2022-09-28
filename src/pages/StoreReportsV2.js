import React, { useEffect, useState, useContext, useMemo } from 'react'
import addWeeks from 'date-fns/addWeeks'
import { useSnackbar } from 'notistack5'
import { capitalCase } from 'capital-case'

// material
import { styled } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { tableCellClasses } from '@material-ui/core/TableCell';
import { Card, Stack, Container, Typography, Box } from '@material-ui/core'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CSVLink } from 'react-csv'
import GetAppIcon from '@material-ui/icons/GetApp'
import Modal from '@material-ui/core/Modal';
import Link from '@material-ui/core/Link';

// components
import Page from '../components/Page'
import LoadingScreen from 'components/LoadingScreen'
import Pagination from 'components/pagination'

// api
import userAPI from 'utils/api/users'
import { SocketContext } from 'utils/context/socket'
import storage from 'utils/storage'


// style
import 'styles/StoreReport.sass'
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Manila')

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const StoreReports = () => {
  const [reports, setReports] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = useState();
  const [users, setUser] = useState([])
  const [isProcessing, setProcessing] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const socket = useContext(SocketContext)
  const [date, setDate] = useState([])

  function createData(month, monthNo) {
    return { month, monthNo };
  }

  const rows = [
    createData('January', '01'),
    createData('February', '02'),
    createData('March', '03'),
    createData('April', '04'),
    createData('May', '05'),
    createData('June', '06'),
    createData('July', '07'),
    createData('August', '08'),
    createData('September', '09'),
    createData('October', '10'),
    createData('November', '11'),
    createData('December', '12'),
  ];

  const load = async () => {
    setProcessing(true)
    setLoading(true)
    const local_user = await storage.getUser()
    if (!local_user) {
      setProcessing(false)
      return setLoading(false)
    }
    const user = JSON.parse(local_user)
    setUser(user)
  }

  useEffect(() => {
    load()
    setLoading(false)
    socket.on('receive_status', async (notif) => {
      load()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleOpen = async (e) => {
    setProcessing(true)
    setLoading(true)
    let monthNo = e.target.getAttribute('month')
    let month = e.target.getAttribute('id')
    let start_date = new Date().getFullYear() + "-" + monthNo + "-01"
    let end_date
    if (monthNo % 2 == 1 || monthNo == "10" || monthNo == "12" || monthNo == "08") {
      if (month === "1stHalf") {
        end_date =  new Date().getFullYear() + "-" + monthNo + "-15"
      }
      else {
        start_date = new Date().getFullYear() + "-" + monthNo + "-16"
        end_date = new Date().getFullYear() + "-" + monthNo + "-31"
      }
    } 
    else {
        if (month === "1stHalf") {
          end_date =  new Date().getFullYear() + "-" + monthNo + "-15"
        }
        else {
          start_date = new Date().getFullYear() + "-" + monthNo + "-16"
          end_date = new Date().getFullYear() + "-" + monthNo + "-30"
        } 
    }
    if (monthNo == "02") {
      if (month === "1stHalf") {
        end_date =  new Date().getFullYear() + "-" + monthNo + "-15"
      }
      else {
        start_date = new Date().getFullYear() + "-" + monthNo + "-16"
        end_date = new Date().getFullYear() + "-" + monthNo + "-28"
      }
    }
    if (monthNo == "09" || monthNo == "11") {
      if (month === "1stHalf") {
        end_date =  new Date().getFullYear() + "-" + monthNo + "-15"
      }
      else {
        start_date = new Date().getFullYear() + "-" + monthNo + "-16"
        end_date = new Date().getFullYear() + "-" + monthNo + "-30"
      }
    } 

    var daysOfYear = []

    for (var d = new Date(start_date); d <= new Date(end_date); d.setDate(d.getDate() + 1)) {
      daysOfYear.push(dayjs(d).format('YYYY-MM-DD'))
    }
    let item = await userAPI.get_user_records_range_v2(users._id, start_date, end_date)
    let chunked = []
    let size = item.data[0].count;

    for (let i = 0;  i < item.data.length; i += size) {
      chunked.push(item.data.slice(i, i + size))
    }
    setMonth(e.target.getAttribute('value'))
    setDate(daysOfYear)
    setReports(chunked)
    setOpen(true);
    setLoading(false)
    setProcessing(false)  
  }

  const handleClose = () => {
    setOpen(false);
  }

  const getCsvData = () => {
    const csvData = []
    if (!reports) return enqueueSnackbar('Unable to download reports')
      reports.map((v, k) => {
        csvData.push(['-', '-', '-', '-', '-', '-'])
        csvData.push([`${dayjs(v[0].date).format('MMM DD,YYYY')}`])
        csvData.push(['Name','time-in', 'Break in', 'Break-out', 'Time out', 'workmate'])
        v.map((e, key) => {
          if(!e.reports) {
            if (e.Employee.displayName === null) {
              csvData.push([
                `${'NULL'}`,
                `-`,
                `-`,
                `-`,
                `-`,
                '-'
              ]) 
            } 
            else {
              csvData.push([
                `${capitalCase(e.Employee.displayName)}`,
                `-`,
                `-`,
                `-`,
                `-`,
                '-'
              ])  
            }
            
          } 
          else {
            console.log(filterByStatus(e.reports.record, 'time-in').time)
            if (e.Employee.displayName === null) {
              if (e.reports.workmate === undefined) {
                csvData.push([
                  `${capitalCase(' ')}`,
                  `${filterByStatus(e.reports.record, 'time-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-out').time}`,
                  `${filterByStatus(e.reports.record, 'time-out').time}`,
                  `${capitalCase(' ')}`
                ])  
              }
              else {
                csvData.push([
                  `${capitalCase(' ')}`,
                  `${filterByStatus(e.reports.record, 'time-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-out').time}`,
                  `${filterByStatus(e.reports.record, 'time-out').time}`,
                  `${capitalCase(e.reports.workmate)}`
                ])
              } 
            } 
            else {
              if (e.reports.workmate === undefined) {
                csvData.push([
                  `${capitalCase(e.Employee.displayName)}`,
                  `${filterByStatus(e.reports.record, 'time-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-out').time}`,
                  `${filterByStatus(e.reports.record, 'time-out').time}`,
                  `${capitalCase('')}`
                ])  
              }
              else {
                csvData.push([
                  `${capitalCase(e.Employee.displayName)}`,
                  `${filterByStatus(e.reports.record, 'time-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-in').time}`,
                  `${filterByStatus(e.reports.record, 'break-out').time}`,
                  `${filterByStatus(e.reports.record, 'time-out').time}`,
                  `${capitalCase(e.reports.workmate)}`
                ])                
              }
            } 
          }
        })
      })
    return csvData
  }

  const renderTime = (_time) => {
    let _date = new Date(_time)
    var hours = _date.getHours()
    var minutes = _date.getMinutes()
    var ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm
    return strTime
  }

  const filterByStatus = (_data, type) => {
    let _d = _data.filter((_d) => (_d.status === type ? _d : ''))
    if (_d.length > 0) {
      _d = _d[0]
    }
    if (_d) {
      if(typeof(_d.time) === "string") {
        return {
          time: _d.time === undefined ? 'n/a' : _d.time,
          location: _d.address === undefined ? 'n/a' : _d.address,
          workmate: _d.workmate === undefined ? '' : 'Workmate( ' +_d.workmate + ' )'
        }
      }
      else {
        return {
          time: _d.time === undefined ? 'n/a' : renderTime(_d.time),
          location: _d.address === undefined ? 'n/a' : _d.address,
          workmate: _d.workmate === undefined ? '' : 'Workmate( ' +_d.workmate + ' )'
        }   
      }   
    } else {
      return '-'
    }
  }

  return (
    <Container>
      {isLoading ? (
        <Box sx={{ height: '50vh' }}>
          <LoadingScreen />
        </Box>
      ) : (
        <TableContainer>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell width="50%">Month</StyledTableCell>
                <StyledTableCell width="50%">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.month}>
                  <StyledTableCell component="th" scope="row">
                    {row.month}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Link href="#" value={row.month} id="1stHalf" month={row.monthNo} onClick={(e) => {handleOpen(e)}}>1st Half</Link>
                    <br/>
                    <Link href="#" value={row.month} id="2ndHalf" month={row.monthNo} onClick={(e) => {handleOpen(e)}}>2nd Half</Link>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {month} Reports
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <CSVLink
              filename={`${month} Record Log.csv`}
              data={getCsvData()}
              style={{
                display: 'flex',
                padding: '0.5 1rem',
                width: '200px',
              }}
            >
              <GetAppIcon sx={{ mr: 1 }} /> <Typography variant="p">Export</Typography>
            </CSVLink>
          </Typography>
        </Box>
      </Modal>
    </Container>
  );

}

export default StoreReports