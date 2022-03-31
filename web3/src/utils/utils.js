//TODO Choose a better name
export function numericValidator(value)
{
	if(value === undefined || isNaN(value)){
		return 0;
	}
	return value;
}