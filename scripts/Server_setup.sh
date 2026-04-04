#!/bin/bash
# ═══════════════════════════════════════════
# 대학교 통합 공지사항 서비스 - 서버 초기 설정 스크립트
# Ubuntu 24.04 LTS (AWS EC2 t3.small)
# ═══════════════════════════════════════════

set -e

echo "▶ 1. 시스템 패키지 업데이트"
sudo apt update && sudo apt upgrade -y

echo "▶ 2. Docker 설치"
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

echo "▶ 3. Docker Compose 설치"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "▶ 4. Git 설치"
sudo apt install -y git

echo "▶ 5. 프로젝트 클론"
sudo mkdir -p /opt/univ-notice
sudo chown $USER:$USER /opt/univ-notice
cd /opt/univ-notice
# git clone https://github.com/YOUR_REPO/univ-notice.git .

echo "▶ 6. 환경변수 설정"
# cp .env.example .env
# nano .env  (실제 값 입력)

echo "▶ 7. Nginx 설치 (리버스 프록시)"
sudo apt install -y nginx

echo "▶ 8. Let's Encrypt SSL 인증서"
sudo apt install -y certbot python3-certbot-nginx
# sudo certbot --nginx -d api.univnotice.kr

echo "▶ 9. UFW 방화벽 설정"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "▶ 10. 스왑 메모리 설정 (t3.small = 2GB RAM)"
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

echo "════════════════════════════════"
echo "✅ 서버 초기 설정 완료!"
echo ""
echo "다음 단계:"
echo "1. .env 파일에 실제 값 입력"
echo "2. docker-compose up -d"
echo "3. Nginx 리버스 프록시 설정"
echo "4. SSL 인증서 발급"
echo "════════════════════════════════"