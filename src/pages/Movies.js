/**
 * Created by chalosalvador on 8/28/20
 */
import React, { useEffect, useState } from 'react';
import { Button, Input, Card, Row, Col, Modal, Descriptions, Form } from 'antd';
import { EyeOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';

const { Meta } = Card;


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  },
};


const Movies = ( props ) => {

  const [ search, setSearch ] = useState( '' );
  const [ movies, setMovies ] = useState( [] );
  const [ showModal, setShowModal ] = useState( false );
  const [ currentMovieId, setCurrentMovieId ] = useState( null );
  const [ movieDetails, setMovieDetails ] = useState( null );

  useEffect( () => {

    const getMovies = async() => {
      if( search !== '' ) {
        const response = await fetch( `http://www.omdbapi.com/?apikey=34fa235a&s=${ search }` );
        const data = await response.json();

        console.log( 'MOVIES', data );

        setMovies( data.Search );
      }
    };

    getMovies();
  }, [ search ] );


  useEffect( () => {

    const getMovieDetails = async() => {
      if( currentMovieId ) {
        const response = await fetch( `http://www.omdbapi.com/?apikey=34fa235a&i=${ currentMovieId }` );
        const data = await response.json();

        console.log( 'MOVIE DETAILS', data );

        setMovieDetails( data );
      }
    };

    getMovieDetails();
  }, [ currentMovieId ] );


  const handleViewDetails = ( id ) => {
    setShowModal( true );
    setCurrentMovieId( id );
  };

  const handleSearchMovie = ( values ) => {
    console.log( 'form values', values );
    setSearch( values.searchText );
  };

  return (
    <>
      <Form
        name='basic'
        // initialValues={ { searchText: 'Cars' } }
        onFinish={ handleSearchMovie }
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Ingrese el nombre de la película'
          name='searchText'
          rules={ [
            {
              required: true,
              message: 'Por favor ingrese el nombre que desea buscar'
            }
          ] }
        >
          <Input style={ { width: 350 } } />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Buscar
          </Button>
        </Form.Item>
      </Form>


      <Row>
        {
          movies.map( ( movie, index ) => {
            return (
              <Col>
                <Card style={ {
                  width: 300,
                  marginRight: 20,
                  marginBottom: 30
                } }
                      cover={
                        <img
                          alt='example'
                          src={ movie.Poster }
                        />
                      }
                      actions={ [
                        <EyeOutlined key='setting' onClick={ () => handleViewDetails( movie.imdbID ) } />,
                        <EditOutlined key='edit' />,
                        <EllipsisOutlined key='ellipsis' />,
                      ] }
                >
                  <Meta
                    // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={ movie.Title }
                    description={ `${ movie.Type } - ${ movie.Year }` }
                  />
                </Card>
              </Col>
            );
          } )
        }
      </Row>

      {
        movieDetails &&
        <Modal
          title={ movieDetails.Title }
          visible={ showModal }
          onOk={ () => setShowModal( false ) }
          onCancel={ () => setShowModal( false ) }
          footer={ null }
          width={ 800 }
        >
          <Descriptions title='User Info' bordered>
            <Descriptions.Item label='Año'>{ movieDetails.Year }</Descriptions.Item>
            <Descriptions.Item label='Calificación'>{ movieDetails.Rated }</Descriptions.Item>
            <Descriptions.Item label='Año Lanzamiento'>{ movieDetails.Released }</Descriptions.Item>
            <Descriptions.Item label='Duración'>{ movieDetails.Runtime }</Descriptions.Item>
            <Descriptions.Item label='Género'>{ movieDetails.Genre }</Descriptions.Item>
          </Descriptions>
        </Modal>
      }

    </>
  );
};


export default Movies;
