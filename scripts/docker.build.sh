parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path/.."
docker build . -t rhmi-lab-order-management-ui
