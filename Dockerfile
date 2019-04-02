FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
    git \
    python3 \
    python3-pip \
    python3-tk \
    python-opencv \
    curl

RUN mkdir /handstracker
WORKDIR /handstracker
RUN mkdir /logs

ADD requirements.txt /handstracker
ADD train.py /handstracker
ADD classify.py /handstracker
ADD classify_webcam.py /handstracker
ADD app.py /handstracker
ADD logs /handstracker/logs

# workaround for downloading lfs large files otherwise just downloads pointer files only
RUN rm logs/output_graph.pb
RUN rm logs/training_summaries/basic/train/events.out.tfevents.1553513319.c6cf3afea9ed
RUN curl -L https://github.com/saltysoup/sign_language_translation/raw/master/logs/output_graph.pb > /handstracker/logs/output_graph.pb
RUN curl -L https://github.com/saltysoup/sign_language_translation/raw/master/logs/training_summaries/basic/train/events.out.tfevents.1553513319.c6cf3afea9ed > /handstracker/logs/training_summaries/basic/train/events.out.tfevents.1553513319.c6cf3afea9ed

RUN pip3 install -r requirements.txt

EXPOSE 80
ENTRYPOINT ["python3"]
CMD ["app.py"]
