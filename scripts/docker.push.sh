QUAY_USER=${QUAY_USER:-evanshortiss}
docker tag rhmi-lab-order-management-ui quay.io/$QUAY_USER/rhmi-lab-order-management-ui:latest
docker push quay.io/$QUAY_USER/rhmi-lab-order-management-ui:latest
