import React from 'react';
import loader from '../../assets/images/loader.gif';

const Spinner = ({ className='' }) => {
	return (
		<div className={className}>
			<img src={loader} alt='loading' />
		</div>
	);
};

export default Spinner;
