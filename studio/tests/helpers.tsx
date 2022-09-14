import { screen, getByText, fireEvent } from '@testing-library/react'
import React, { useState } from 'react'
import { SWRConfig } from 'swr'

import { render as originalRender } from '@testing-library/react'
import { RootStore } from 'stores'
import { StoreProvider } from 'hooks'
interface SelectorOptions {
  container?: HTMLElement
}

/**
 * Returns the toggle button given a text matcher
 *
 * Defaults to screen if container option is not provided
 */
export const getToggleByText = (
  text: string | RegExp,
  options: SelectorOptions = {}
): HTMLElement | null => {
  const container = options?.container
  let textNode
  if (container) {
    textNode = getByText(container as HTMLElement, text)
  } else {
    textNode = screen.getByText(text)
  }
  if (textNode && textNode.parentElement) {
    return textNode.parentElement.querySelector('button')
  } else {
    return textNode
  }
}

export const clickDropdown = (elem: HTMLElement) => {
  fireEvent.pointerDown(
    elem,
    new window.PointerEvent('pointerdown', {
      ctrlKey: false,
      button: 0,
    })
  )
}

/**
 * A custom render function for react testing library
 * https://testing-library.com/docs/react-testing-library/setup/#custom-render
 */
const SwrTestConfig: React.FC = ({ children }) => {
  const [rootStore] = useState(() => new RootStore())

  return (
    <StoreProvider rootStore={rootStore}>
      <SWRConfig
        value={{
          provider: () => new Map(),
          shouldRetryOnError: false,
        }}
      >
        {children}
      </SWRConfig>
    </StoreProvider>
  )
}
type renderParams = Parameters<typeof originalRender>
export const render = ((ui: renderParams[0], options: renderParams[1]) =>
  originalRender(ui, { wrapper: SwrTestConfig, ...options })) as typeof originalRender

// function MyApp({ Component, pageProps }: AppPropsWithLayout) {
//   const [rootStore] = useState(() => new RootStore())

//   useEffect(() => {
//     async function handleEmailVerificationError() {
//       const { error } = await auth.initialize()

//       if (error?.message === GOTRUE_ERRORS.UNVERIFIED_GITHUB_USER) {
//         rootStore.ui.setNotification({
//           category: 'error',
//           message:
//             'Please verify your email on GitHub first, then reach out to us at support@supabase.io to log into the dashboard',
//         })
//       }
//     }

//     handleEmailVerificationError()
//   }, [])

//   const getLayout = Component.getLayout ?? ((page) => page)

//   return (
//     <StoreProvider rootStore={rootStore}>
//       <FlagProvider>
//         <Head>
//           <title>Supabase</title>
//           <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//           <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
//         </Head>
//         <PageTelemetry>
//           <RouteValidationWrapper>
//             <AppBannerWrapper>{getLayout(<Component {...pageProps} />)}</AppBannerWrapper>
//           </RouteValidationWrapper>
//         </PageTelemetry>
//         <PortalToast />
//       </FlagProvider>
//     </StoreProvider>
//   )
// }
