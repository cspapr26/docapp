import time
import asyncio
import aiohttp

URL = "http://k8s-default-appingre-5fda151b2b-1177123344.us-west-1.elb.amazonaws.com/appointments"  # Replace with your application's URL
TARGET_RPS = 1000  # Adjust as needed

async def send_request(session):
    try:
        async with session.get(URL) as response:
            await response.text()
    except Exception as e:
        print(f"Request failed: {e}")

async def main():
    async with aiohttp.ClientSession() as session:
        start_time = time.time()
        request_count = 0
        
        while True:
            batch_start = time.time()
            tasks = [send_request(session) for _ in range(TARGET_RPS)]
            await asyncio.gather(*tasks)
            
            request_count += TARGET_RPS
            elapsed_time = time.time() - start_time
            current_rps = request_count / elapsed_time
            
            print(f"Sent {request_count} requests. Current RPS: {current_rps:.2f}")
            
            time_to_wait = 1 - (time.time() - batch_start)
            if time_to_wait > 0:
                await asyncio.sleep(time_to_wait)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Script terminated by user")