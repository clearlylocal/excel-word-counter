import { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Instructions } from './pages/Instructions'

export const Routes: FC = () => {
	return (
		<Switch>
			<Route exact path='/'>
				<Home />
			</Route>
			<Route path='/instructions'>
				<Instructions />
			</Route>
		</Switch>
	)
}
