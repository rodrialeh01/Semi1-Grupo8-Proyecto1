from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto, compararPassword
from db import  obtenerConexion
from io import BytesIO

BlueprintAlbum = Blueprint('album', __name__)

@BlueprintAlbum.route('/album/crear', methods=['POST'])
def crearAlbum():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un formulario
        nombre = request.form['nombre']
        descripcion = request.form['descripcion']
        id_artista = request.form['id_artista']
        imagen = request.files['imagen']

        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        if imagen.filename != '':
            data = imagen.read()

        status = False

        

        #Guardar la imagen
        nombre_imagen = guardarObjeto(BytesIO(data), extension,"Fotos/")
        id_foto = nombre_imagen['Key']
        path_foto = nombre_imagen['Location']
        cursor.execute("INSERT INTO album (nombre, descripcion, id_artista, id_imagen, path_imagen) VALUES (%s, %s, %s, %s, %s);", (nombre, descripcion, id_artista, id_foto, path_foto))

        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintAlbum.route('/album/listar', methods=['GET'])
def listarAlbum():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT album.*, CONCAT(artista.nombres, ' ', COALESCE(artista.apellidos, '')) AS nombre_artista FROM album LEFT JOIN artista ON album.id_artista = artista.id_artista;") #id_album, id_artista, nombre, descripcion, id_imagen, path_imagen
        album = cursor.fetchall()
        #Pasar a un json
        for i in range(len(album)):
            album[i] = {
                'id_album': album[i][0],
                'id_artista': album[i][1],
                'nombre': album[i][2],
                'descripcion': album[i][3],
                'id_imagen': album[i][4],
                'path_imagen': album[i][5],
                'nombre_artista': album[i][6]
            }
        cursor.close()
        conexion.close()
        return jsonify(album)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintAlbum.route('/album/ver/album/<id_album>', methods=['GET'])
def verAlbumId(id_album):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT * FROM album WHERE id_album = %s;", (id_album,))
        album = cursor.fetchone()
        #Pasar a un json
        album = {
            'id_album': album[0],
            'id_artista': album[1],
            'nombre': album[2],
            'descripcion': album[3],
            'id_imagen': album[4],
            'path_imagen': album[5]
        }
        cursor.close()
        conexion.close()
        return jsonify(album)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({})

@BlueprintAlbum.route('/album/ver/<id_artista>', methods=['GET'])
def verAlbum(id_artista):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT * FROM album WHERE id_artista = %s;", (id_artista,))
        album = cursor.fetchall()
        cursor.close()
        conexion.close()
        #Pasar a un json
        for i in range(len(album)):
            album[i] = {
                'id_album': album[i][0],
                'id_artista': album[i][1],
                'nombre': album[i][2],
                'descripcion': album[i][3],
                'id_imagen': album[i][4],
                'path_imagen': album[i][5]
            }
        return jsonify(album)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintAlbum.route('/album/ver/canciones/<id_album>', methods=['GET'])
def verCancionesAlbum(id_album):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT cancion.*, id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion_album.id_album = %s;", (id_album,))
        album = cursor.fetchall()
        #Pasar a un json
        for i in range(len(album)):
            album[i] = {
                'id_cancion': album[i][0],
                'nombre': album[i][1],
                'duracion': album[i][2],
                'id_imagen': album[i][3],
                'path_imagen': album[i][4],
                'path_cancion': album[i][5],
                'id_obj_cancion': album[i][6],
                'id_album': album[i][7]
            }
        cursor.close()
        conexion.close()
        return jsonify(album)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintAlbum.route('/album/modificar/info/<id_album>', methods=['PATCH'])
def modificarAlbum(id_album):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un json
        nombre = request.json['nombre']
        descripcion = request.json['descripcion']
        id_artista = request.json['id_artista']

        cursor.execute("UPDATE album SET nombre = %s, descripcion = %s, id_artista = %s WHERE id_album = %s;", (nombre, descripcion, id_artista, id_album))
        
        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintAlbum.route('/album/modificar/imagen/<id_album>', methods=['PATCH'])
def modificarImagenAlbum(id_album):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un formulario
        imagen = request.files['imagen']

        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        if imagen.filename != '':
            data = imagen.read()

        status = False

        #Eliminar la imagen anterior y guardar la nueva
        cursor.execute("SELECT id_imagen FROM album WHERE id_album = %s;", (id_album,))

        result = cursor.fetchall()

        if len(result) > 0:
            id_foto = result[0][0]
            eliminarObjeto(id_foto)
            nombre_imagen = guardarObjeto(BytesIO(data), extension,"Fotos/")
            id_foto = nombre_imagen['Key']
            path_foto = nombre_imagen['Location']
            cursor.execute("UPDATE album SET path_imagen = %s, id_imagen = %s WHERE id_album = %s;", (path_foto, id_foto, id_album))
            status = cursor.rowcount > 0
            conexion.commit()
        
        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

#Falta probar hasta que se creen canciones
@BlueprintAlbum.route('/album/add/song', methods=['POST'])
def addSong():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        id_album = request.json['id_album']
        id_cancion = request.json['id_cancion']

        cursor.execute("INSERT INTO cancion_album (id_album, id_cancion) VALUES (%s, %s);", (id_album, id_cancion))

        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintAlbum.route('/album/eliminar/', methods=['DELETE'], strict_slashes=False)
def eliminarAlbum():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        idAlbum = data['idAlbum']
        idUser = data['idUser']
        password = data['password']
        status = False

        cursor.execute("SELECT * FROM usuario WHERE id_usuario = %s;", (idUser,))
        result = cursor.fetchone()

        if len(result) > 0:
            if result[6] != 1:
                status = False
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            contraseniaCifrada = result[4]
            status = compararPassword(password, contraseniaCifrada)
            if status == False:
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            
            cursor.execute("SELECT id_imagen FROM album WHERE id_album = %s;", (idAlbum,))
            result = cursor.fetchall()

            if len(result) > 0:
                if result[0][0] != None:
                    id_imagen = result[0][0]
                    eliminarObjeto(id_imagen)
                cursor.execute("DELETE FROM album WHERE id_album = %s;", (idAlbum,))
                status = cursor.rowcount > 0
                conexion.commit()
                
        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintAlbum.route('/album/eliminar/song', methods=['DELETE'])
def deleteSongAlbum():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        id_album = data['id_album']
        id_cancion = data['id_cancion']
        status = False
        cursor.execute("DELETE FROM cancion_album WHERE id_album = %s AND id_cancion = %s;", (id_album, id_cancion))
        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()
        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})
