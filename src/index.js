// highlight
import './utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

import 'react-quill/dist/quill.snow.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import '_style.css'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {HelmetProvider, Helmet} from 'react-helmet-async'
import {SettingsProvider} from 'utils/context/settings'
import {CollapseDrawerProvider} from 'utils/context/drawer'

import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

import React from 'react'
/*
Bugsnag.start({
  apiKey: 'd543c4256472e5b07abb24b6bb97cf69',
  plugins: [new BugsnagPluginReact()]
})

const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)*/


  const USERSNAP_API_KEY = "5db6ed72-2881-4310-ac50-712e39193b7e"
  const USERSNAP_GLOBAL_API_KEY =  "5db6ed72-2881-4310-ac50-712e39193b7e";
  {/*api.show('${USERSNAP_API_KEY}') */}
ReactDOM.render(
  <React.StrictMode>
    {/*<ErrorBoundary>*/}
      <HelmetProvider>
          <Helmet>
          <script type="text/javascript">
            {`
              window.onUsersnapCXLoad = function(api) {
                api.init();
                window.Usersnap = api;
                function setNotification(event) {
                  console.log(event)
                  fetch(
                    '  https://discord.com/api/webhooks/839333433451741195/OVuAGjqKQfkRpbkZi8LEN6CQnP9mAXjF69LDkmPpcpLZDHacDjPwq64Yf7QbR_0mckCX',
                    {
                      method: 'post',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        // the username to be displayed
                        username: 'Usersnap Notification',
                        // the avatar to be displayed
                        avatar_url:
                          'https://findicons.com/files/icons/1994/vista_style_business_and_data/256/users.png',
                        // contents of the message to be sent
                        content:
                         " A user " +event.values.ordered_inputs[0].value+" submitted a feedback "+event.values.comment.text+" from "+ event.values.client.url+" - check more here - https://board.usersnap.com/Xd1ubYHmzd9rotx9",
                      }),
                    }
                  );
                }
                api.on('submit', setNotification);
              }
              var script = document.createElement('script');
              script.defer = 1;
              script.src = 'https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad';
              document.getElementsByTagName('head')[0].appendChild(script);
            `}
          </script>
        </Helmet>
        <SettingsProvider>
          <CollapseDrawerProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CollapseDrawerProvider>
        </SettingsProvider>
      </HelmetProvider>
    {/*</ErrorBoundary>*/}
  </React.StrictMode>,
  document.getElementById('root'),
)

/*Bugsnag.notify(new Error('Test error'))*/

// If you want to enable client cache, register instead.
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
