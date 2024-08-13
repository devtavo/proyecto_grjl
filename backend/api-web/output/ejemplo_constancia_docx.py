from docxtpl import DocxTemplate
import sys
import requests
import time
import os
from win32com import client
word_app = client.Dispatch("Word.Application")

# parametros de conexion
host = 'localhost'
port = '2005'

# valida y recoge los argumentos
# args = sys.argv[1:]
# if len(args) < 1:
#     print('Se requieren al menos 2 argumentos.')
#     print('Uso: python script.py <memberId> ')
#     sys.exit(1)
#
# memberId = args[0]
# anio = [];
# data = [];
#
# obj = {
#     'mid': memberId
# }

# Realizar la consulta POST a la API con parámetros en el cuerpo
response = requests.post('http://'+host+':'+port+'/api/generaDataConstancia')

# Verificar si la consulta fue exitosa (código de respuesta 200)
if response.status_code == 200:
    # Obtener la respuesta en formato JSON
    response_data = response.json()

    # Validar que la respuesta sea una lista
    if isinstance(response_data, list):
        # Crear directorio de salida si no existe
        output_dir = "./output/constancias/"
        os.makedirs(output_dir, exist_ok=True)

        # Inicializar objeto Word
        word_app = client.Dispatch("Word.Application")

        # Iterar sobre los objetos en el array
        for elemento in response_data:
            if not os.path.exists(output_dir+elemento['vFechaConstancia']):
                # Crea la carpeta
                os.makedirs(output_dir+elemento['fecha'])
            doc = DocxTemplate("output/template/template_constancia.docx")
            cod = elemento.get("id", "")
            fecha = elemento.get("vFechaConstancia", "")
            context = elemento
            doc.render(context)

            # Generar nombre de archivo único para el PDF
            filename = f"{cod}_{fecha}.pdf"
            filepath = os.path.join(output_dir+elemento['fecha']+'/', filename)
#            print(filepath)
            # Guardar el archivo generado en formato .docx
            doc.save(filepath.replace(".pdf", ".docx"))

            # Convertir el archivo .docx a .pdf utilizando Word
            docx_path = os.path.abspath(filepath.replace(".pdf", ".docx"))
            pdf_path = os.path.abspath(filepath)
            doc = word_app.Documents.Open(docx_path)
            doc.SaveAs(pdf_path, FileFormat=17)
            print(filename)
            doc.Close()

        # Cerrar la aplicación de Word
        word_app.Quit()

    else:
        print("La respuesta de la API no es una lista.")
else:
    # La consulta no fue exitosa, mostrar mensaje de error
    print('Error en la consulta:', response.status_code)

