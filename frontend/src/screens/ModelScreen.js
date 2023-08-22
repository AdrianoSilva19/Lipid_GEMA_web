import React, {useEffect,useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'


function ModelScreen() {
  const { model_id } = useParams();
  const [lipid, setLipid] = useState(null);

  useEffect(() => {
    async function fetchLipidData() {
      try {
        const response = await axios.get(`/api/model/${model_id}`);
        setLipid(response.data);
      } catch (error) {
        console.error('Error fetching lipid data:', error);
      }
    }

   
    setLipid(null);
    fetchLipidData();
  }, [model_id]); 



  return (
    <div>
      <h2>This is your Model sugested annotations</h2>
      <p>Model ID: {model_id}</p>
      {/* Your additional content */}
    </div>
  );
}

export default ModelScreen;