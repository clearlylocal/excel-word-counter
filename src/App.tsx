import { FC } from 'react'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'
import { Routes } from './Routes'

export const App: FC = () => {
	return (
		<>
			<Router basename={process.env.PUBLIC_URL}>
				<nav className='tabs'>
					<img
						className='site-title'
						alt='Clearly Local'
						src={process.env.PUBLIC_URL + '/cl-logo-small.png'}
					/>

					<NavLink exact activeClassName='active' to='/'>
						Word Counter
					</NavLink>
					<NavLink activeClassName='active' to='/instructions'>
						Instructions
					</NavLink>
				</nav>
				<main className='container'>
					<Routes />
				</main>
			</Router>
		</>
	)
}
