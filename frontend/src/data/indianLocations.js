export const INDIAN_STATES_CITIES = [
  { state: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Tirupati", "Kakinada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Anantapur", "Kadapa"] },
  { state: "Arunachal Pradesh", cities: ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro", "Bomdila"] },
  { state: "Assam", cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur", "Tinsukia", "Bongaigaon"] },
  { state: "Bihar", cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Purnia", "Darbhanga", "Ara", "Begusarai", "Katihar", "Munger"] },
  { state: "Chhattisgarh", cities: ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur"] },
  { state: "Goa", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"] },
  { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Morbi"] },
  { state: "Haryana", cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"] },
  { state: "Himachal Pradesh", cities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Hamirpur"] },
  { state: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh"] },
  { state: "Karnataka", cities: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru", "Udupi", "Vijayapura"] },
  { state: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Palakkad", "Kottayam", "Malappuram"] },
  { state: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Satna", "Ratlam", "Rewa", "Dewas"] },
  { state: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded", "Jalgaon", "Akola"] },
  { state: "Manipur", cities: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"] },
  { state: "Meghalaya", cities: ["Shillong", "Tura", "Jowai", "Nongstoin"] },
  { state: "Mizoram", cities: ["Aizawl", "Lunglei", "Champhai", "Saiha"] },
  { state: "Nagaland", cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"] },
  { state: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur", "Balasore", "Puri", "Baripada"] },
  { state: "Punjab", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Moga"] },
  { state: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali"] },
  { state: "Sikkim", cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan"] },
  { state: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur"] },
  { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Suryapet"] },
  { state: "Tripura", cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"] },
  { state: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Aligarh", "Bareilly", "Gorakhpur", "Jhansi", "Moradabad", "Saharanpur", "Mathura"] },
  { state: "Uttarakhand", cities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Kashipur", "Rudrapur"] },
  { state: "West Bengal", cities: ["Kolkata", "Siliguri", "Durgapur", "Asansol", "Howrah", "Kharagpur", "Malda", "Bardhaman"] },
  { state: "Delhi", cities: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Karol Bagh"] },
  { state: "Jammu and Kashmir", cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Pulwama"] },
  { state: "Ladakh", cities: ["Leh", "Kargil"] },
  { state: "Andaman and Nicobar Islands", cities: ["Port Blair", "Diglipur", "Mayabunder"] },
  { state: "Chandigarh", cities: ["Chandigarh"] },
  { state: "Dadra and Nagar Haveli and Daman and Diu", cities: ["Daman", "Silvassa", "Diu"] },
  { state: "Lakshadweep", cities: ["Kavaratti", "Agatti", "Amini"] },
  { state: "Puducherry", cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"] },
];

export const INDIAN_STATES = INDIAN_STATES_CITIES.map((item) => item.state);

export const getCitiesForState = (stateName) => {
  const state = INDIAN_STATES_CITIES.find((item) => item.state === stateName);
  return state ? state.cities : [];
};

export const formatIndianLocation = (city, state) => `${city}, ${state}`;
