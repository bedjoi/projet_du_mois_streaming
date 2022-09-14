import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container,InputGroup,FormControl,Button,Row,Card } from "react-bootstrap";

const clientId = "d83e88b3c6a3466db43c0d90323616b2";
const clientSecret = "38732f8c526a479e9cbec71e7eff2b3f";

export default function Library() {
  const [searchInput, setSearchInput]= useState("")
  const [accessToken,setAccessToken]=useState("")
  const [albums,setAlbums]= useState([])

  useEffect(() => {
    console.log(clientId)
    var params ={
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': "Basic "+ Buffer.from(clientId+':'+clientSecret).toString("base64")
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
  }).toString()

  }
  fetch('https://accounts.spotify.com/api/token', params)
  .then(result => result.json())
  .then(data =>setAccessToken(data.access_token))

},[])
async function search(){
  console.log('Searching '+searchInput)
  //get request using search to get the Artist ID
  const searchParameters={
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+accessToken
    }
  }
  const artistID = await fetch('https://api.spotify.com/v1/search?q='+ searchInput + '&type=artist', searchParameters)
  .then(response => response.json())
  .then(data =>{ return data.artists.items[0].id} )
  console.log("the artistID is "+artistID)
  //Get request whith Artist id GRAB ALL THE ALBUMS that artist
  const albums = await fetch('https://api.spotify.com/v1/artists/'+ artistID +'/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
  .then(response => response.json())
  .then(data =>{
    console.log(data)
    setAlbums(data.items)
});
}
 console.log(albums);

  return (
    <div className="screen-container">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
          placeholder="Search for a Artist"
          type="input"
          onKeyPress={event=>{
            if(event.key === 'Enter') {
              search()
          }}
        }
        onChange={event=> setSearchInput(event.target.value)}/>
        <Button onClick={search}>Seach</Button>


        </InputGroup>
      </Container>
      <Container>
      <Row className="mx-2 row row-cols-4">
      {albums.map((album,i)=>{
        return(
          <Card>
          <Card.Img src={album.images[0].url}/>
          <Card.Body>
          <Card.Title>{album.name} </Card.Title>
          </Card.Body>
          <iframe style={{borderRadius:"12px"}} src="https://open.spotify.com/embed/album/0tCOMESQmYFABNuADuXK2l?utm_source=generator" width="100%" height="200" frameBorder="0" allowFullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </Card>
          )
          })
        }
        </Row>
      </Container>

      
    </div>
  );

}