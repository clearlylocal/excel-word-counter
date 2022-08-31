import { FC } from 'react'
import { Home } from './Home'
import { Switch, Route } from 'react-router-dom'
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
