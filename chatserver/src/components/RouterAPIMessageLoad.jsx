import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RouterAPIMessageLoad() {
  const [messages, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setMessage(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);
        const cname ="general";
        const response = await axios.get(
            'http://localhost:5000/chat-server-by-react/us-central1/v1//channels/general/messages'
        );
        setMessage(response.data); // 데이터는 response.data 안에 들어있습니다.
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!messages) return null;
  return (
    <ul>
        {messages.messages.map(message => (
            <li key={message.id}>
                {message.body}
            </li>
        ))}
    </ul>
  );
}


export default RouterAPIMessageLoad;

