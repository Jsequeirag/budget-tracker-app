import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes'
import ErrorBoundary from './components/common/ErrorBoundary'
import Toast from './components/common/Toast'
import { useToastStore } from './store/useToastStore'
import { getErrorMessage } from './lib/utils/error'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      useToastStore.getState().addToast(getErrorMessage(error), 'error')
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      useToastStore.getState().addToast(getErrorMessage(error), 'error')
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toast />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
