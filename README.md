# projectBlockchainGg
Project blockchain dengan menggunakan solidity dan web3.js.
Kasus untuk project ini adalah membuat todo list sederhana dengan menggunakan smart contract
Pada halaman frontend, user bisa melakukan:
1. add Task
2. update task (jika sudah dikerjakan)
3. Remove task

Untuk smart contract terdiri dari beberapa fungsi:
1. addTask dengan ketentuan only owner
2. getTask untuk mengambil data task berdasarkan task index
3. updateStatus akan mengubah boolean job 
4. deleteTask akan menghapus task by index
5. getTaskCount akan mengembalikan jumlah task yang ada di blockchain

Untuk aplikasi ini, sudah dicoba dengan menggunakan Ganache
