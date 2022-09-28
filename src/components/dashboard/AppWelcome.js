import PropTypes from 'prop-types';
// material
import { styled } from '@material-ui/core/styles';
import { Typography, Box, Card, CardContent } from '@material-ui/core';
import { SeoIllustration } from 'assets/index';

// component
import HelpButton from 'components/discord'
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.lighter,
    [theme.breakpoints.up('md')]: {
        height: '100%',
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}));

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
    displayName: PropTypes.string
};

export default function AppWelcome({ user }) {
    return (
        <RootStyle>
            <CardContent
                sx={{
                    p: { md: 0 },
                    pl: { md: 5 },
                    color: 'grey.800'
                }}
            >
                <Typography gutterBottom variant="h4">
                    Welcome back,
                    <br /> {!user ? 'User' : `${user.firstName} ${user.lastName}`}!
                </Typography>

                <Typography variant="body2" sx={{ pb: { xs: 3, xl: 2 }, maxWidth: 480, mx: 'auto' }}>
                    If you need assistance or concerns let us know, Just click the Contact Us!
                </Typography>

                <Box sx={{ float: 'left' }}>
                    <HelpButton />
                </Box>
            </CardContent>

            <SeoIllustration
                sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' }
                }}
            />
        </RootStyle>
    );
}
