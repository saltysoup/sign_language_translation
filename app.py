#!/usr/bin/env python
# -*- coding: utf-8 -*- 

import base64
import os
import json
from flask import Flask, request, Response
from classify import getModelResponse  

app = Flask(__name__)

def getInference(imagePath):
    data = getModelResponse(imagePath)
    print (data)
    return (data)

@app.route("/", methods=['GET'])
def healthCheck():
    return "This is a health check page"

@app.route("/api/infer", methods=['POST'])
def inference():
    try:
        raw_form = request.form
        img_data = raw_form['image']
        localPath = "/tmp/"
        fileName = "picture.png"
        fullPath = localPath + fileName

        with open(fullPath, "wb") as fh:
            fh.write(base64.b64decode(img_data))

        modelResponse = getInference(fullPath)

        return Response(modelResponse, mimetype='application/json', status=200)
    except Exception as e:
        print ("error when decoding b64 form data and saving to /tmp")
        print (e)
        return Response(json.dumps({'Error': e}), mimetype='application/json', status=500)
    


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
