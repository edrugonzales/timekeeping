import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack5'

// material
import { DataGrid } from '@material-ui/data-grid'
import { Card, Stack, Container, Typography, Box } from '@material-ui/core'

// components
import Page from '../components/Page'
import LoadingScreen from 'components/LoadingScreen'
import BranchButton from 'components/branch'
// api
import storage from 'utils/storage'
import user_api from 'utils/api/users'
import Bugsnag from '@bugsnag/js'


const StoreBranches = () => {
    const { enqueueSnackbar } = useSnackbar()
    const [branches, setBranches] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const local_user = await storage.getUser()
            if (!local_user) {
                Bugsnag.notify(local_user)
                setLoading(false)
                return enqueueSnackbar('Unable to proceed, Kindly Re-log again', { variant: 'warning' })
            }
            const user = JSON.parse(local_user)
            const branch = await user_api.get_user_branch(user._id);
            if (!branch.ok) {
                setLoading(false)
                Bugsnag.notify(branch)
                return enqueueSnackbar('Unable to fetch branches', { variant: 'warning' })
            }
            setLoading(false)
            const formatted_data = format_data(branch.data)
            setBranches(formatted_data)
        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const format_data = (_user) => {
        if (_user.msg && _user.msg === 'No Records') return []
        let _data =
            _user &&
            _user.map((v_user, k) => {
                return {
                    id: v_user._id,
                    company: v_user.company,
                    parentCompany: v_user.parentCompany,
                    createdAt: new Date(v_user.createdAt),
                }
            })

        if (!_data) return
        return _data
    }


    const columns = [
        { field: 'id', headerName: '', width: 25 },
        {
            field: 'company',
            headerName: 'Branch Name',
            width: 250,
        },
        {
            field: 'parentCompany',
            headerName: 'Parent Company',
            width: 250,
        },
        {
            field: 'createdAt',
            headerName: 'Created Date',
            width: 500,
        },

    ]

    return (
        <Page title="Store branches | Time In">
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Store Branches
                    </Typography>
                </Stack>
                {isLoading ? (
                    <Box sx={{ height: '50vh' }}>
                        <LoadingScreen />
                    </Box>
                ) : (
                    <>
                        <BranchButton />
                        {branches ?
                            <Card sx={{ my: 5 }}>
                                <div style={{ height: '60vh', width: '100%' }}>
                                    <DataGrid
                                        rows={branches}
                                        columns={columns}
                                        pageSize={10}
                                        loading={isLoading}
                                        disableSelectionOnClick
                                    />
                                </div>
                            </Card> : ''}

                    </>
                )}
            </Container>
        </Page>
    )
}

export default StoreBranches
