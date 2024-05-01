import React, { useState } from 'react';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';

const Jitsi = () => {
	const { user } = useSelector((store) => store.user);
  const { meetupId } = useParams();
	const [isReady, setReady] = useState(false)
	const t = process.env.REACT_APP_JITSI_APP
	console.log(t);
	return (
    <div className='h-screen relative'>
      { !isReady && <Spinner className='absolute z-50 w-full flex h-screen items-center justify-center'/>}
			<JaaSMeeting
				appId={t}
				userInfo={{ displayName: user?.name }}
				roomName={meetupId}
				configOverwrite={{
					disableThirdPartyRequests: true,
					disableLocalVideoFlip: true,
					backgroundAlpha: 0.5,
				}}
				interfaceConfigOverwrite={{
					VIDEO_LAYOUT_FIT: 'nocrop',
					MOBILE_APP_PROMO: false,
					TILE_VIEW_MAX_COLUMNS: 4,
				}}
				getIFrameRef={(iframe) => {
					iframe.style.height = '100vh';
					iframe.style.width = '100vw';
				}}
				spinner={() => {
					console.log('loading');
				}}
				onApiReady={(externalApi) => {
          console.log('ready');
          setReady(true)
				}}
			/>
		</div>
	);
};

export default Jitsi;
