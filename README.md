# Live

- [소개](#소개)
- [기능](#기능)
- [기술 스택](#기술-스택)
- [배포](#배포)
- [마치며](#마치며)

## 소개

live는 협업 프로그램 슬랙을 클론 코딩한 토이 프로젝트

![로그인](https://user-images.githubusercontent.com/50465901/101741175-16ea4e80-3b0d-11eb-8dec-5604c25e2f44.png)
![일대일](https://user-images.githubusercontent.com/50465901/101741187-1a7dd580-3b0d-11eb-89bb-f69f0ca9df9f.png)
![초대](https://user-images.githubusercontent.com/50465901/101741193-1ea9f300-3b0d-11eb-96b0-c543696e6ad5.png)
![다대다](https://user-images.githubusercontent.com/50465901/101741203-2073b680-3b0d-11eb-9747-cb04a373af24.png)
![이미지전송](https://user-images.githubusercontent.com/50465901/101741209-223d7a00-3b0d-11eb-9d1f-fa435272f590.png)

## 기능

- facebook, google OAuth를 이용한 인증
- 로그 아웃
- 채널
  - 채널 추가
  - 채널 맴버 추가
  - 채널 삭제
  - 다대다 채팅 (이미지 업로더 가능)
- 친구
  - 친구 추가
  - 친구 삭제
  - 일대일 채팅 (이미지 업로더 가능)
  - 친구 로그인 상태 확인

## 기술 스택

### [FrontEnd](https://github.com/csh9066/live-front)

- typescript
- create-react-app
- react
- redux
- redux toolkit
- antd
- socket.io-client
- styled-components
- react-quill
- axios

### [BackEnd](https://github.com/csh9066/live-backend)

- typescript
- express
- mysql
- typeorm
- passport
- socket.io
- multer
- AWS-S3

## 배포

### FrontEnd

- 정적 웹 호스팅 서비스인 AWS amfity를 이용해 배포

### Backend

- AWS ec2와 프록시 서버 nginx를 이용한 배포
- 데이터베이스 서버는 AWS rds를 따로 두어서 데이터의 보관의 안정성을 더 높임
- 이미지 서버는 AWS s3를 이용해 관리

## 마치며

### 좋았던 점

- **배포 경험**</br>
  이번 프로젝트를 하면서 처음으로 배포를 해봤다. express 배포 환경 세팅, 우분투 환경 경험, 도메인 구매, nginx를 이용한 https 설정 등 굉장히 나한테 새로운 경험이었다. 개발에 좀 더 넓은 시야를 가질 수 있게 되었고 코딩뿐만 아닌 인프라 지식에 대한 필요성을 실감할 수 있었다.

- **타입스크립트 사용**</br>
  기존에 익숙했던 자바스크립트에서 타입스크립트를 이용해서 프로젝트를 진행했다. 처음 배운 프로그래밍 언어가 자바여서 그런지 타입스크립트를 배우는데 큰 어려움이 없었다. 오타 나거나 없는 프로퍼티를 디버깅하느라 삽질할 일도 없어지고 무엇보다 자동완성 기능을 자바스크립트 보다 잘 지원해 줘서 편리했다. 앞으로도 계속 타입스크립트를 사용할 거 같다.

### 아쉬웠던 점

- **지저분한 코드**</br>
  프로젝트가 길어질수록 전체적인 구조에 대한 아쉬움이 많았고 기능을 추가할수록 코드가 굉장히 지저분해지는 느낌이 들었고 어떻게 짜야 좋은 구조이고 깔끔한 코드인지 감이 안 잡혀서 굉장히 답답했다. 앞으로 좋은 코드를 짜는 방법에 대해 일 순위로 학습할 것이고 현재 프로젝트를 리팩토링할 예정이다.
