
// asks user for their name
var name = prompt('What is your name?'); 
// capitalize the first character and lowercase the rest, concatenate the two results
name = name.toUpperCase().charAt(0) + name.toLowerCase().substring(1);
// asks for age and immediately converts to int
var age = parseInt(prompt('How old are you?'));
// asks for temp degrees F and immediately converts to int
var temp = parseInt(prompt('What is the temperature? (Degrees F)'));

// tells user how old they are in dog years, by multiplying age by 7
alert(`${name}, you are ${age * 7} years old in dog years`);
// tells user degrees F in degrees C by subtracting 32 from temp then multiplying by 5/9
alert(`${name}, ${temp} degrees Fahrenheit is ${((temp - 32) * (5/9)).toFixed(2)} degrees Celsius`);