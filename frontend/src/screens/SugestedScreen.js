import { useParams, useSearchParams } from 'react-router-dom';

function SugestedScreen() {
  const { model_id, lipidKey } = useParams();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');

  if (!from) {
    return (
      <div>
        No 'from' value found in query parameters. Please check how you're passing the value.
      </div>
    );
  }

  return (
    <div>
      Model ID: {model_id} <br />
      Lipid Key: {lipidKey} <br />
      This is the 'from' value: {from}
    </div>
  );
}

export default SugestedScreen;



