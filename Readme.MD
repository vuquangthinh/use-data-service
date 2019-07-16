

# INSTALL
```
npm install use-data-service
```

# HOW TO USE

```

import useDataService from 'use-data-service';

// example: get data from axios / fetch / AsyncStorage (react-native) ...
async function getDetail({ id }) {
  return {
    success: false,
    data: {
      id: 1,
      title: 'foo',
      content: 'bar'
    }
  };
}

// postId from location.query.id / deeplink ...
function ListUI({ postId }) {
  const [loading, data, error] = useDataService(getDetail, { id: postId});

  if (loading) {
    return <Spin />
  }

  return (
    <Detail>
      <Title>{data.title}</Title>
      <Content>{data.content}</Content>
    </Detail>
  )
}

```
