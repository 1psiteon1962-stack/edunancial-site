export default function CountryAvailability(){

return(

<section className="mx-auto max-w-7xl px-6 py-20">

<h2 className="text-5xl font-black text-white">

Availability

</h2>

<table className="w-full mt-10">

<thead>

<tr className="text-left text-blue-400">

<th>Country</th>

<th>Status</th>

<th>Payments</th>

</tr>

</thead>

<tbody>

<tr>

<td className="py-4 text-white">United States</td>

<td className="text-green-400">LIVE</td>

<td className="text-gray-300">Square</td>

</tr>

<tr>

<td className="py-4 text-white">Canada</td>

<td className="text-yellow-400">Testing</td>

<td className="text-gray-300">Canadian Processor</td>

</tr>

<tr>

<td className="py-4 text-white">Uganda</td>

<td className="text-gray-400">Locked</td>

<td className="text-gray-300">Sendwave</td>

</tr>

</tbody>

</table>

</section>

);

}
