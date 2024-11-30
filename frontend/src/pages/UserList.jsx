import React from 'react';
import { Button, Container, Heading, Image, Text } from '@yamada-ui/react';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const navigate = useNavigate();
  // logout
  const handleLogoutClick = async () => {
    // fetch version
    let response = await fetch(`/api/logout`);
    const data = await response.json();
    console.log('server response: ', data);
    if (response.ok) {
      navigate('/');
    }
  };

  return (
    <div>
      <Container centerContent>
        <Image
          src="https://dragon-ball-official.com/assets/img/intro/intro_2.png"
          maxW="sm"
        />

        <Heading size="xl">『ドラゴンボール』（DRAGON BALL）</Heading>

        <Text>
          『ドラゴンボール』（DRAGON
          BALL）は、鳥山明による日本の漫画作品。『週刊少年ジャンプ』（集英社）にて1984年51号から1995年25号まで連載された。世界中に散らばった七つの球をすべて集めると、どんな願いも一つだけ叶えられるという秘宝・ドラゴンボールと、主人公・孫悟空（そん・ごくう）を中心に展開する、「冒険」「夢」「バトル」「友情」などを描いた長編漫画。
        </Text>
        <Button onClick={handleLogoutClick}>ログアウト</Button>
      </Container>
    </div>
  );
};

export default UserList;
