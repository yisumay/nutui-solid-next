import { GridLocalProps } from './grid'
import { createContext } from '@/hooks/create-context'

type GridContextType = Omit<GridLocalProps, 'onClickItem'>

export const [GridContextProvider, useGridContext, GridContext]
  = createContext<GridContextType>({
    name: 'GridContext',
    hookName: 'useGridContext',
    providerName: 'GridContextProvider',
  })
