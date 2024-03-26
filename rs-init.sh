echo "Checking if rs01 is already a replica set..."
if mongo --eval "rs.status()" >/dev/null 2>&1; then
    echo "rs01 is already a replica set."
else
    echo "Initiating rs01 replica set..."
    mongo --eval "rs.initiate({_id: 'rs01', members: [{_id: 0, host: 'localhost:27017'}]})"
fi