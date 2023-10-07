import PrivateRoute from '../components/PrivateRoute';
import Home from '../pages/video-conference/Home';
import Jitsi from '../pages/video-conference/Jitsi';
import MeetUp from '../pages/video-conference/MeetUp';

const meetUp = {
	path: '/meetup',
	element: (
		<PrivateRoute>
			<MeetUp />
		</PrivateRoute>
  ),
  children: [{
    path: '',
    element: <Home />
  },
    {
      path: ':meetupId', 
      element:  <Jitsi /> ,
  }]
};

export default meetUp;
