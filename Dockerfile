FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
    git \
    python3 \
    python3-pip \
    python3-tk \
    python-opencv \
    curl
# installing git lfs for large files
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:git-core/ppa
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | /bin/bash
RUN apt-get install -y git-lfs
RUN git lfs install

RUN mkdir /handstracker
WORKDIR /handstracker

ADD requirements.txt /handstracker
ADD train.py /handstracker
ADD classify.py /handstracker
ADD classify_webcam.py /handstracker
ADD app.py /handstracker
ADD logs /handstracker

RUN pip3 install -r requirements.txt

EXPOSE 80
ENTRYPOINT ["python3"]
CMD ["app.py"]
