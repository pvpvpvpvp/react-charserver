import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RouterAPIConnect() {
  const [channels, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setUsers(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);
        const response = await axios.get(
            'http://localhost:5000/chat-server-by-react/us-central1/v1/channels'
        );
        setUsers(response.data); // 데이터는 response.data 안에 들어있습니다.
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!channels) return null;
  return (
    <ul>
        <li>
            axios get channels 채널의 목록 api 응답 결과
        </li>
        <li key={channels.channels}>
         {channels.channels}
        </li>
    </ul>
  );
}


export default RouterAPIConnect;

